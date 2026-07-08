import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Note } from './notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(dto: CreateNoteDto): Promise<Note> {
    const { categoryIds, ...noteData } = dto;
    const note = this.notesRepository.create(noteData);

    if (categoryIds && categoryIds.length > 0) {
      note.categories = await this.categoriesRepository.findBy({
        id: In(categoryIds),
      });
    }

    const saved = await this.notesRepository.save(note);
    return this.findOne(saved.id);
  }

  async findAll(categoryId?: number): Promise<Note[]> {
    const where: any = {};
    if (categoryId) {
      where.categories = { id: categoryId };
    }
    return this.notesRepository.find({
      where,
      relations: { categories: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return note;
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    const { categoryIds, ...noteData } = dto;
    const note = await this.findOne(id);
    Object.assign(note, noteData);

    if (categoryIds !== undefined) {
      note.categories =
        categoryIds.length > 0
          ? await this.categoriesRepository.findBy({ id: In(categoryIds) })
          : [];
    }

    await this.notesRepository.save(note);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    await this.notesRepository.remove(note);
  }
}
