function updateItem(params){
    try{

    }catch(e){
        return {
        status: "cancelled",
        error: "Update cancelled due to:\n" + e.message}
    }
}