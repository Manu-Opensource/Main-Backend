
export default interface User {
    id: string;
    email: string;
    passwordHashed: string;
    
    completedLessons: number[];
    completedCourses: number[];
}

