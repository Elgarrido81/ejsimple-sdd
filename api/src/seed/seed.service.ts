import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../notes/notes.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async onModuleInit(): Promise<void> {
    const categoryCount = await this.categoriesRepository.count();
    if (categoryCount > 0) return;

    const categories = await this.categoriesRepository.save([
      { name: 'Trabajo', color: '#4f46e5' },
      { name: 'Personal', color: '#10b981' },
      { name: 'Salud', color: '#ef4444' },
      { name: 'Estudio', color: '#f59e0b' },
    ]);

    const notes = await this.notesRepository.save([
      { title: 'Estudiar TypeORM', content: 'ManyToMany relations con PostgreSQL' },
      { title: 'Comprar víveres', content: 'Leche, pan, huevos, fruta, verduras' },
      { title: 'Hacer ejercicio', content: '30 min de cardio y estiramientos' },
      { title: 'Leer documentación', content: 'Revisar guía de NestJS y Angular 18' },
      { title: 'Preparar presentación', content: 'Slides para la reunión del equipo' },
      { title: 'Meditar', content: '10 min de meditación guiada antes de dormir' },
      { title: 'Curso de Angular', content: 'Completar sección 5: Routing avanzado' },
      { title: 'Presupuesto mensual', content: 'Revisar gastos y ajustar presupuesto del mes' },
      { title: 'Dockerizar app', content: 'Crear Dockerfiles y docker-compose para el proyecto' },
      { title: 'Llamar al médico', content: 'Agendar cita de control anual' },
      { title: 'Estudiar patrones de diseño', content: 'Singleton, Factory, Observer en TypeScript' },
      { title: 'Escribir tests', content: 'Unit tests para servicios de NestJS con Jest' },
    ]);

    await this.notesRepository.save([
      { ...notes[0], categories: [categories[3]] },
      { ...notes[1], categories: [categories[1]] },
      { ...notes[2], categories: [categories[2]] },
      { ...notes[3], categories: [categories[0], categories[3]] },
      { ...notes[4], categories: [categories[0]] },
      { ...notes[5], categories: [categories[2]] },
      { ...notes[6], categories: [categories[3]] },
      { ...notes[7], categories: [categories[1]] },
      { ...notes[8], categories: [categories[0], categories[3]] },
      { ...notes[9], categories: [categories[2]] },
      { ...notes[10], categories: [categories[3]] },
      { ...notes[11], categories: [categories[0], categories[3]] },
    ]);
  }
}
