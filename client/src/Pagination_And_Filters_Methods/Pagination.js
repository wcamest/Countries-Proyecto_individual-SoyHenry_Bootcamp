export const get_pagination_data = (input_data, max_items) => {

    let aux_input_data = [...input_data];
    let pagination_data = [];

    while(aux_input_data.length){
        if(aux_input_data.length >= max_items){
            pagination_data.push(aux_input_data.splice(0, max_items));
        } else {
            pagination_data.push(aux_input_data);
            aux_input_data = [];
        }
    }

    return pagination_data;
}