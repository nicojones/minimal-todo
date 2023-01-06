export interface CaughtPromise<T = any> {
    response: {
        status: number;
        message: string;
        data: T
    }
}