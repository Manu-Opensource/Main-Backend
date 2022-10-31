
export default interface User {
    id: string;
    email: string;
    passwordHashed: string;
    
    completedLessons: string[];
    completedCourses: string[];
}

