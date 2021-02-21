import { observable, action, makeObservable, computed } from 'mobx'
import axios from "axios";
import {ClientStore} from './ClientStore'

export class ClientsStore {
    constructor() {
        this.clients = []

        makeObservable(this, {
            clients: observable,
            addClient: action, 
            countEmail: computed,
            hottestCountry: computed,
            totalNewClients: computed,
            getFormmatedDate: action,
            outStandClients: computed,
            getOwners: computed,
            updateOwner: action,
            updateEmail: action,
            declareSale: action,
            update: action
        })
       
    }  
    
    async addClient(input){
        const client = new ClientStore(input.name, input.surName, input.owner, input.country)
        console.log(client)
        await axios.post("/client", client)
    }

    get countEmail() {
        let count = this.clients.filter(e => e.email_type != '-');
        return count.length;
    }

    get hottestCountry(){
        const countryObj = {}
        this.clients.forEach(c => { countryObj[c.country] = 0})
        this.clients.forEach(c => { if (c.sold) countryObj[c.country]++})
        let max = countryObj[Object.keys(countryObj)[0]]
        let hottest = ""
        for(let key of Object.keys(countryObj)) {
            if(countryObj[key] >= max) {
                max = countryObj[key]
                hottest = key
                
            }
        }
        return hottest   
    }

    getFormmatedDate = date => {
        date = new Date(date);
        let month = date.toLocaleString('en-us', { month: 'long' })
        let year = date.getFullYear();
        return `${year}${month}`;
    };

    get totalNewClients() {
        let filtered = this.clients.filter(d =>
            this.getFormmatedDate(Date.now()) === this.getFormmatedDate(d.date))
        return filtered.length;
    }

    get outStandClients() {
        let numClients = this.clients.filter(c => !c.sold );
        return numClients.length;
    };

    get getOwners() {
        let owners = new Set();
        this.clients.map(o => owners.add(o.owner));
        let ownersArray = Array.from(owners);
        return ownersArray;
    };

    findName = (input) => {
        let client = this.clients.find(c => c.first + " " + c.last === input.name);
        return client.first + " " + client.last;
    };

    updateOwner = async (input) => {
        if (input.name) {
            await axios.put(`/owner/${this.findName(input)}/${input.transfer}`)
            input.transfer = ''
            input.name = ''
        } else {
            alert("Please Insert Client Name")
        }
    }


    updateEmail = async (input) => {
        if (input.name) {
            await axios.put(`/email/${this.findName(input)}/${input.email}`);
            input.email = ''
            input.name = ''
        } else {
            alert("Please Insert Client Name")
        }
    }

    declareSale = async (input) => {
        if (input.name) {
            await axios.put(`/declare/${this.findName(input)}`);
            input.name = ''
        } else {
            alert("Please Insert Client Name")
        }
    }

    update = async (client, input) => {
        client.country = input.country;
        const name = input.name + " " + input.surName
        await axios.put(`/client/${name}`, client);
        client.first = `${input.name}`;
        client.last = `${input.surName}`;
    };
}
