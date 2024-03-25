import { useEffect, useState, useRef, useMemo } from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const apiData = useRef(undefined);
    const [loaded, setLoaded] = useState(false);

    const [toggleColor, setToggleColor] = useState(false);
    const [toggleSort, setToggleSort] = useState(true);
    const [sortType, setSortType] = useState<number>(0);
    const [deletedRows, setDeletedRows] = useState<number[]>([]);
    const [countryFilter, setCountryFilter] = useState<string>("");

    const orderedData:any = useMemo(()=>sortTab(),[sortType, toggleSort, loaded]);
    const filteredData:any = useMemo(()=>filter(),[countryFilter, orderedData]);
    const deletedData:any = useMemo(()=>deleteRows(),[deletedRows, filteredData]);
    
    useEffect(()=>{
        GetUser()
        .then((result)=>{
            setValues(result);
            setLoaded(true);
        })
        .catch((error) => {
            console.log("Error: ", error);
            alert("An error has ocurred with the ApiCall.");
        });
    },[]);

    const setValues = (result:any) => {
        result.forEach((element:any, key:number)=>{ //add unique Key to Data elements
            element.id = key;
        })
        apiData.current = result;
    }

    function sortTab () {
        let dataCopy:any[] = [];
        if (apiData.current != undefined){
            dataCopy = [...apiData.current];    
        }

        if (sortType!==0){
            switch (sortType){
                case 1:
                dataCopy.sort((a:any, b:any) => a.name.first.localeCompare(b.name.first));
                    break;
                case 2:
                dataCopy.sort((a:any, b:any) => a.name.last.localeCompare(b.name.last));
                    break;
                case 3:
                    if (!toggleSort) {
                        dataCopy.sort((a:any, b:any) => a.location.country.localeCompare(b.location.country));
                    }else{
                        setSortType(0);
                    }
                    break;
                default:
                    setSortType(0);
                    break;
            }
        }     
        return dataCopy;
    }
    
    function filter () {
        if (countryFilter != "") {
             return orderedData.filter((element:any) => element.location.country.toLowerCase().startsWith(countryFilter));
        }else{
            return orderedData;
        }
    }

    function deleteRows () {
        let data:any[] = [...filteredData];
        if (deletedRows.length > 0) {
            deletedRows.forEach((row)=>{
                function isTrue(element:any){ //element from filteredData
                    return (element.id == row);
                }
                let index = data.findIndex(isTrue);
                if (index >= 0){ //per si es borra un element que despres es filtra.
                    data.splice(index, 1);
                }
            })
        }
        return data;
    }

    function filterWord (e:any) {
        setCountryFilter(e.target.value);
    }

    function sortTable (type:number) {
        if (type===3){
            setToggleSort(!toggleSort);    
        }else{
            setToggleSort(true);
        }
        setSortType(type);
    }


    return(
        <main>
            <h1>Prueba Técnica</h1>
            <div className="buttons">
                <button className={toggleColor? "active":""} onClick={()=>setToggleColor(!toggleColor)}>Colorear</button>
                <button className={sortType===3? "active":""} onClick={()=>sortTable(3)}>Ordenar por país</button>
                <button onClick={()=>setDeletedRows([])}>Resetear estado</button>
                <input onKeyUp={()=>filterWord(event)}></input>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th className={sortType===1? "active":""} onClick={()=>sortTable(1)}>Nombre</th>
                        <th className={sortType===2? "active":""} onClick={()=>sortTable(2)}>Apellido</th>
                        <th className={sortType===3? "active":""} onClick={()=>sortTable(3)}>País</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className={toggleColor ? "colorActive" : ""}>
                    {deletedData.map((element:any)=>{
                        return(
                            <tr key={element.id}>
                                <td>
                                    <img src={element.picture.thumbnail}></img>
                                </td>
                                <td>{element.name.first}</td>
                                <td>{element.name.last}</td>
                                <td>{element.location.country}</td>
                                <td>
                                    <button onClick={()=>setDeletedRows([...deletedRows, element.id])}>Borrar</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </main>
    );
}