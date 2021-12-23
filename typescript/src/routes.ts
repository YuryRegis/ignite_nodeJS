import {Request, Response} from 'express'
import CreateCourseService from './createCourseService'


export function CreateCourse(request: Request, response: Response) {
    CreateCourseService.execute({
        name: 'TypeScript',
        duration: 9,
        educator: 'Jhonatan'
    })
}