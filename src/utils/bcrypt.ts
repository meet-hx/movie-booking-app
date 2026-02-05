import bcrypt from "bcrypt";

export class Bcrypt {
    static hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static hashSync(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
    
    static compareSync(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

}