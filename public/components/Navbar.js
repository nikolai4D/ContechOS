export default class Navbar {
    cconstructor() {
        
    }
    
    async getTemplate() {

        return `
        <div id="navbar">
            <ul>
                <li class="navTitle" data-link="/">Graph Database</li>
                <li class="navObj" data-link="/props">Props</li>
                <li class="navObj" data-link="/configs">Configs</li>
                <li class="navObj" data-link="/datas">Datas</li>
            <button class="navLogout" data-link="/logout">Logout</button>
            </ul> 
        </div>
        
        
        
        
        `
    }
}
