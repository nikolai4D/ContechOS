
export default class Dashboard {
    
    constructor() {
        document.title = "Dashboard";
    }

    async getTemplate() {
        return `
        <div class="container">
            <h1>Dashboard</h1>
        </div>
        `
    }
}

