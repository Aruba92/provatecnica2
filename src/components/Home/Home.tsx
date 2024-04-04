import { useEffect, useState, useRef, useMemo } from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const apiData = useRef(undefined);
    const [loaded, setLoaded] = useState(false);

    const [toggleColor, setToggleColor] = useState(false);
    const [toggleSort, setToggleSort] = useState(true);
    const [sortType, setSortType] = useState<number>(0);
    const [filters, setFilters] = useState<Filters>({
        wordToFilter: "",
        deletedRowsId: []
    });

    interface Filters {
        wordToFilter: string,
        deletedRowsId: number[]
    }

    const orderedData:any = useMemo(()=>sortTab(),[sortType, toggleSort, loaded]);
    const renderData:any = useMemo(()=>{
        let data:any = [...orderedData];
        return filterData(data);
    },[orderedData, filters]);
    
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
    
    function filterData (data:any[]) {
        if (filters.wordToFilter != "") {
             data = data.filter((element:any) => element.location.country.toLowerCase().startsWith(filters.wordToFilter));
        }
        if (filters.deletedRowsId.length > 0) {
            filters.deletedRowsId.forEach((row)=>{
                function isTrue(element:any){ //element from filteredData
                    return (element.id == row);
                }
                let index = data.findIndex(isTrue);
                data.splice(index, 1);
            })
        }
        return data;
    }

    function changeFilters (wordParam:any, rowId:number) {
        let array = filters.deletedRowsId;
        const word = wordParam==""? filters.wordToFilter : wordParam.target.value;

        if (rowId>=0){
            array.push(rowId);
        }

        let filtersP:Filters = {
            wordToFilter : word,
            deletedRowsId : array
        }
        setFilters(filtersP);
    }

    function resetFilters () {
        let filtersP:Filters = {
            wordToFilter : filters.wordToFilter,
            deletedRowsId : []
        }
        setFilters(filtersP);
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
                <button onClick={()=>resetFilters()}>Resetear estado</button>
                <input onKeyUp={()=>changeFilters(event, -1)}></input>
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
                    {renderData.map((element:any)=>{
                        return(
                            <tr key={element.id}>
                                <td>
                                    <img src={element.picture.thumbnail}></img>
                                </td>
                                <td>{element.name.first}</td>
                                <td>{element.name.last}</td>
                                <td>{element.location.country}</td>
                                <td>
                                    <button onClick={()=>changeFilters("", element.id)}>Borrar</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </main>
    );
}