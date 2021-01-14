import { observable, makeObservable, action, computed } from 'mobx'

export class ClientStore {

    constructor(first, last, owner, country) {
        this.first = first
        this.last = last
        this.owner = owner
        this.country = country
        this.email= ""
        this.emailType= null
        this.firstContact= ""
        this.sold = false

        makeObservable(this, {
            first: observable,
            last: observable,
            country: observable,
            owner: observable,
            sold: observable,
            firstContact: observable,
            email: observable,
            emailType: observable

        })
    }

}