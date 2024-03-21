import { useEffect, useState, useRef } from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const hasLoadedBefore = useRef(true); //for avoid two initial apiCalls every time (react do 2 renders)
    const [apiData, setApiData] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);

    const [toggleColor, setToggleColor] = useState(false);
    const [toggleSort, setToggleSort] = useState(true);
    const [sortType, setSortType] = useState<number>(0);
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
    },[sortType, toggleSort, deletedRows, countryFilter])

    const setValues = (result:any) => {
        setApiData(result);
        setData([...result]);
    }
    
    function modifyData () {
        /*INITIALIZE A NEW TABLE DATA FROM apiData*/
        let data:any[] = [...apiData];

        /*SORT TABLE DATA BY COUNTRY, NAME OR LASTNAME*/
        if (sortType!==0){
            switch (sortType){
                case 1://name
                    data.sort((a, b) => a.name.first.localeCompare(b.name.first));
                    break;
                case 2://lastName
                    data.sort((a, b) => a.name.last.localeCompare(b.name.last));
                    break;
                case 3://country
                    if (!toggleSort) {
                        data.sort((a, b) => a.location.country.localeCompare(b.location.country));
                    }else{
                        setSortType(0);
                    }
                    break;
                default:
                    setSortType(0);
                    break;
            }
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
                <button onClick={restartData}>Resetear estado</button>
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