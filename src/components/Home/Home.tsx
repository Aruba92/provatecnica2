import { useEffect, useState, useRef} from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const hasLoadedBefore = useRef(true); //for avoid two initial apiCalls every time (react do 2 renders)
    const [apiData, setApiData] = useState<any[]>([]);
    //const [data, setData] = useState<any[]>([]);

    const [toggleColor, setToggleColor] = useState(false);
    
    const [toggleSort, setToggleSort] = useState(true);
    const [sortType, setSortType] = useState<number>(0);
    const [deletedRows, setDeletedRows] = useState<number[]>([]);
    const [countryFilter, setCountryFilter] = useState<string>("");

    useEffect(()=>{
        if (hasLoadedBefore.current){
            GetUser().then((result)=>{
                setInitialValues(result);
            });
            hasLoadedBefore.current = false;
        }
    },[]);

    useEffect(()=>{
        modifyData();
    },[sortType, toggleSort, deletedRows, countryFilter])

    const setInitialValues = (result:any) => {
        //setApiData(result);
        result.forEach((element:any, key:number)=>{ //add unique Key to Data elements
            element.id = key;
            element.filtrat = true,
            element.borrat = false
        })
        setApiData([...result]);
    }
    
    function modifyData () {
        /*INITIALIZE A NEW TABLE DATA FROM apiData*/
        //let dataCopy:any[] = [...data];

        /*SORT TABLE DATA BY COUNTRY, NAME OR LASTNAME*/
        if (sortType!==0){
            switch (sortType){
                case 1://name
                apiData.sort((a, b) => a.name.first.localeCompare(b.name.first));
                    break;
                case 2://lastName
                apiData.sort((a, b) => a.name.last.localeCompare(b.name.last));
                    break;
                case 3://country
                    if (!toggleSort) {
                        apiData.sort((a, b) => a.location.country.localeCompare(b.location.country));
                    }else{
                        apiData.sort((a, b) => a.id - b.id);
                        setSortType(0);
                    }
                    break;
                default:
                    apiData.sort((a, b) => a.id - b.id);
                    setSortType(0);
                    break;
            }
        } 
        
        /*DELETE TABLE ROW*/
        if (deletedRows.length > 0) {
            deletedRows.forEach((row)=>{
                function isTrue(element:any){
                    if (element.id == row){
                        return true;
                    }else{
                        return false;
                    }
                }
                let index = apiData.findIndex(isTrue);
                apiData[index].borrat = true;
            })
        }

        /*FILTER BY COUNTRY*/
        if (countryFilter != "") {
            apiData.forEach((row:any)=>{
                if (row.location.country.toLowerCase().startsWith(countryFilter)){
                    row.filtrat = true;
                }else{
                    row.filtrat = false;
                }
            })
        }else{
            apiData.forEach((row:any)=>{
                row.filtrat = true;
            })
        }

        /*SAVE CHANGES IN TABLE DATA*/
        setApiData([
            ...apiData //spread syntax
        ]);
    }
    
    function restartData () {
        setDeletedRows([]);
        apiData.forEach((row:any)=>{
            row.borrat = false;
        })
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
                    {apiData.map((element:any)=>{
                        if (element.borrat==false && element.filtrat ==true) {
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
                        }
                    })}
                </tbody>
            </table>
        </main>
    );
}