import { replaceInFile } from 'replace-in-file';
import moment from 'moment-timezone';

const timeStamp = moment(new Date()).tz('America/Cuiaba').format("DD/MM/YYYY hh:mm");

const options = {
    files: [
        'src/environments/environment.ts',
        'src/environments/environment.homolog.ts',
        'src/environments/environment.prod.ts',
    ],
    from: /timeStamp: '(.*)'/g,
    to: "timeStamp: '" + timeStamp + "'",
    allowEmptyPaths: false,
};

try {
    let changedFiles = await replaceInFile(options);
    if (changedFiles.length === 0) {
        throw new Error("Please make sure that the file '" + options.files + "' has \"timeStamp: ''\"");
    }
    console.log('Build timestamp is set to: ' + timeStamp);
} catch (error) {
    console.error('Error occurred:', error);
    throw error;
}
