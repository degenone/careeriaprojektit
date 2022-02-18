import React from 'react';
import { Picker } from "@react-native-picker/picker";
import { Category } from "./NWInterfaces";

export default function NWCategoryPicker(props:{ selectedCatId: string, setSelectedCatId: Function, categories: Category[], selectAll: boolean }) {
    return (
        <Picker
            prompt='Valitse tuoteryhmä'
            selectedValue={props.selectedCatId}
            style={{ height: 50, width: props.selectAll ? '60%' : '100%' }}
            onValueChange={(itemValue) => props.setSelectedCatId(itemValue)}
        >
            {props.selectAll && <Picker.Item key={0} value='0' label='Kaikki tuoteryhmät' />}
            {props.categories.map((item: Category) => (
                <Picker.Item key={item.categoryId} value={item.categoryId.toString()} label={`${item.categoryId} — ${item.categoryName}`} />
            ))}
        </Picker>
    );
}

{/* <Picker.Item value='1' label='Juomat' />
<Picker.Item value='2' label='Mausteet' />
<Picker.Item value='3' label='Makeiset' />
<Picker.Item value='4' label='Maitotuotteet' />
<Picker.Item value='5' label='Jyvät/Viljat' />
<Picker.Item value='6' label='Liha/Siipikarja' />
<Picker.Item value='7' label='Vihannekset' />
<Picker.Item value='8' label='Kala/Äyriäiset' /> */}