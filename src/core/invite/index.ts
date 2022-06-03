export class Invite {
    code!: string;
    url!: string;

    constructor(raw: Required<Invite>) {
        Object.assign(this, raw);
    }
}
