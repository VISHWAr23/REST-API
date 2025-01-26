import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromise } from 'fs';
import * as path from 'path';


@Injectable()
export class MyLoggerService  extends ConsoleLogger{

    async logToFile(entry : string){
        const formatedEntry = `${Intl.DateTimeFormat( 'en-Us' ,{
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/New_York'
        }).format(new Date())} \t ${entry}\n`;

        try {
            if (!fs.existsSync(path.join(__dirname,'..', '..', 'logs'))){
                await fsPromise.mkdir(path.join(__dirname, '..', '..', 'logs'));
            }
            await fsPromise.appendFile(path.join(__dirname, '..', '..', 'logs', 'app.log'), formatedEntry);
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
    }
}

    log(message: any, context?: string) {
        const entry = `${ message }\t${ context }`;
        this.logToFile(entry);
        super.log(message, context);
    }

    error(message: any, stockOrContext?: string) {
        const entry = `${ stockOrContext }\t${ message}`;
        this.logToFile(entry);
        super.error(message, stockOrContext);
    }
}
