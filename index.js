const { Command } = require('commander');
const contactsOperations = require("./contacts");

const program = new Command();
program
    .option('-a, --action <type>', 'choose action')
    .option('-i, --id <type>', 'user id')
    .option('-n, --name <type>', 'user name')
    .option('-e, --email <type>', 'user email')
    .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
        case 'list':
            const contacts = await contactsOperations.listContacts();

            if (!contacts) {
                throw new Error(`The database is empty`)
            }

            console.table(contacts);
            break;

        case 'get':
            const contact = await contactsOperations.getContactById(id);

            if (!contact) {
                throw new Error(`Contact with id=${id} not found`)
            }
            console.table(contact);
            break;

        case 'add':
            const newContact = await contactsOperations.addContact(name, email, phone);

            console.log('You successfully add a new contact', newContact);
            break;

        case 'remove':
            const removeContact = await contactsOperations.removeContact(id);

            if (!removeContact) {
                throw new Error(`Contact with id=${id} not found`)
            }

            console.log('You successfully remove contact', removeContact);
            break;

        default:
            console.warn('\x1B[31m Unknown action type!');
    }
}

invokeAction(argv);