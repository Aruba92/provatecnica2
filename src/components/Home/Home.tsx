import { useEffect, useState, useRef } from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const hasLoadedBefore = useRef(true); //for avoid two initial apiCalls every time (react do 2 renders)
    const [apiData, setApiData] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);

    const [toggleColor, setToggleColor] = useState(false);
    const [toggleOrder, setToggleOrder] = useState(false);
    const [deletedRows, setDeletedRows] = useState<number[]>([]);
    const [countryFilter, setCountryFilter] = useState<string>("");

    useEffect(()=>{
        if (hasLoadedBefore.current){
            GetUser().then((result)=>{
                setValues(result);
            });
            hasLoadedBefore.current = false;
        }
    },[]);

    useEffect(()=>{
        modifyData();
    },[toggleOrder,deletedRows, countryFilter])

    const setValues = (result:any) => {
        setApiData(result);
        setData([...result]);
    }
    
    function modifyData () {
        /*INITIALIZE A NEW TABLE DATA FROM apiData*/
        let data:any[] = [...apiData];

        /*ORDER TABLE DATA BY COUNTRY*/
        if (toggleOrder) {
            data.sort((a, b) => a.location.country.localeCompare(b.location.country));
        }
        
        /*DELETE TABLE ROW*/
        if (deletedRows.length > 0) {
            deletedRows.forEach((row)=>{
                function isTrue(element:any){
                    if (element.email == row){
                        return true;
                    }else{
                        return false;
                    }
                }
                let index = data.findIndex(isTrue);
                data.splice(index, 1);
            })
        }

        /*FILTER BY COUNTRY*/
        if (countryFilter != "") {
            let filteredData = data.filter((element:any) => element.location.country.toLowerCase().startsWith(countryFilter));
            data = filteredData;
        }

        /*SAVE CHANGES IN TABLE DATA*/
        setData([
            ...data //spread syntax
        ]);
    }

    function restartData () {
        setDeletedRows([]);
        setData([...apiData]);
    }

    function filterWord (e:any) {
        setCountryFilter(e.target.value);
    }


    return(
        <main>
            <h1>Prueba Técnica</h1>
            <div className="buttons">
                <button className={toggleColor? "active":""} onClick={()=>setToggleColor(!toggleColor)}>Colorear</button>
                <button className={toggleOrder? "active":""} onClick={()=>setToggleOrder(!toggleOrder)}>Ordenar por país</button>
                <button onClick={restartData}>Resetear estado</button>
                <input onKeyUp={()=>filterWord(event)}></input>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th className={toggleOrder? "active":""} onClick={()=>setToggleOrder(!toggleOrder)}>País</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className={toggleColor ? "colorActive" : ""}>
                    {data.map((element:any)=>{
                        let key =element.email;
                        return(
                            <tr key={key}>
                                <td>
                                    <img src={element.picture.thumbnail}></img>
                                </td>
                                <td>{element.name.first}</td>
                                <td>{element.name.last}</td>
                                <td>{element.location.country}</td>
                                <td>
                                    <button onClick={()=>setDeletedRows([...deletedRows, key])}>Borrar</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </main>
    );
}