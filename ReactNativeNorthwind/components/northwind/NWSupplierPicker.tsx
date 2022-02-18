import React from 'react';
import { Picker } from "@react-native-picker/picker";
import { INWSuppliersResponse } from "./NWInterfaces";

export default function NWSupplierPicker(props: { selectedSuppId: string, setSelectedSuppId: Function, suppliers: INWSuppliersResponse[] }) {
    return (
        <Picker
            prompt='Valitse toimittaja'
            selectedValue={props.selectedSuppId}
            style={{ height: 50, width: '100%' }}
            onValueChange={(itemValue) => props.setSelectedSuppId(itemValue)}
        >
            {props.suppliers.map((item: INWSuppliersResponse) => (
                <Picker.Item key={item.supplierId} value={item.supplierId.toString()} label={`${item.supplierId} — ${item.companyName}`} />
            ))}
        </Picker>
    )
}

{/* <Picker.Item value='1' label="Exotic Liquids" />
<Picker.Item value='2' label="New Orleans Cajun Delights" />
<Picker.Item value='3' label="Grandma Kelly's Homestead" />
<Picker.Item value='4' label="Tokyo Traders" />
<Picker.Item value='5' label="Cooperativa de Quesos 'Las Cabras'" />
<Picker.Item value='6' label="Mayumi's" />
<Picker.Item value='7' label="Pavlova, Ltd." />
<Picker.Item value='8' label="Specialty Biscuits, Ltd." />
<Picker.Item value='9' label="PB Knäckebröd AB" />
<Picker.Item value='10' label="Refrescos Americanas LTDA" />
<Picker.Item value='11' label="Heli Süßwaren GmbH &amp; Co. KG" />
<Picker.Item value='12' label="Plutzer Lebensmittelgroßmärkte AG" />
<Picker.Item value='13' label="Nord-Ost-Fisch Handelsgesellschaft mbH" />
<Picker.Item value='14' label="Formaggi Fortini s.r.l." />
<Picker.Item value='15' label="Norske Meierier" />
<Picker.Item value='16' label="Bigfoot Breweries" />
<Picker.Item value='17' label="Svensk Sjöföda AB" />
<Picker.Item value='18' label="Aux joyeux ecclésiastiques" />
<Picker.Item value='19' label="New England Seafood Cannery" />
<Picker.Item value='20' label="Leka Trading" />
<Picker.Item value='21' label="Lyngbysild" />
<Picker.Item value='22' label="Zaanse Snoepfabriek" />
<Picker.Item value='23' label="Karkki Oy" />
<Picker.Item value='24' label="G'day, Mate" />
<Picker.Item value='25' label="Ma Maison" />
<Picker.Item value='26' label="Pasta Buttini s.r.l." />
<Picker.Item value='27' label="Escargots Nouveaux" />
<Picker.Item value='28' label="Gai pâturage" />
<Picker.Item value='29' label="Forêts d'érables" /> */}