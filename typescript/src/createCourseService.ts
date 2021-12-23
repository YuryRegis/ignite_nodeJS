
interface Props {
    name: string;
    duration: number;
    educator: string;
}
class CreateCourseService{
    execute({name, duration, educator}:Props){
        console.log({name, duration, educator})
    }
}

export default new CreateCourseService()