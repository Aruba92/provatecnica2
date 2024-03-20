import { useEffect, useState, useRef } from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const hasLoadedBefore = useRef(true); //for avoid two initial apiCalls every time (react do 2 renders)
    const [apiData, setApiData] = useState<any[]>([]);
    const [tableDataDisordered, setTableDataDisordered] = useState<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [toggleColor, setToggleColor] = useState(false);
    const [toggleOrder, setToggleOrder] = useState(false);

    useEffect(()=>{
        if (hasLoadedBefore.current){
            GetUser().then((result)=>{
                setValues(result);
            });
            hasLoadedBefore.current = false;
        }
    },[apiData]);

    const setValues = (result:any) => {
        setApiData(result);
        setTableData([...result]);
        setTableDataDisordered([...result]);
    }

    useEffect(()=>{ //Change the Data in the table according to toggleOrder to Order or Disorder the data.
        if (toggleOrder) {
            tableData.sort((a, b) => a.location.country.localeCompare(b.location.country));
            setTableData([
                ...tableData //spread syntax
            ]);
        }else{
            setTableData([
                ...tableDataDisordered
            ]);
        }
    },[toggleOrder])

    /* function deleteArrow () {
        
    } */

    return(
        <main>
            <h1>Prueba Técnica</h1>
            <div className="buttons">
                <button className="addColorButton" onClick={()=>setToggleColor(!toggleColor)}>Colorear</button>
                <button className="orderByCountry" onClick={()=>setToggleOrder(!toggleOrder)}>Ordenar por país</button>
                <button className="restartState">Resetear estado</button>
                <input className="filterByCountry"></input>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>País</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className={toggleColor ? "colorActive" : ""}>
                    {tableData.map((element:any, k:number)=>{
                        return(
                            <tr key={k+"0"}>
                                <td key={k+"1"}>
                                    <img src={element.picture.thumbnail}></img>
                                </td>
                                <td key={k+"2"}>{element.name.first}</td>
                                <td key={k+"3"}>{element.name.last}</td>
                                <td key={k+"4"}>{element.location.country}</td>
                                <td key={k+"5"}>
                                    <button /* onClick={deleteArrow} */>Borrar</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </main>
    );
}