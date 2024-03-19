import { useEffect, useState } from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const [data, setData] = useState<any[]>([]);
    let results:any[] = [];

    useEffect(()=>{
        GetUser(setData);
    },[]);

    getRowsData();
    function getRowsData () {
        if (data.length > 0){
            results = data.map((element:any, k:number)=>{
                return(
                    <tr>
                        <td key={k}>
                            <img src={element.picture.thumbnail}></img>
                        </td>
                        <td key={k}>{element.name.first}</td>
                        <td key={k}>{element.name.last}</td>
                        <td key={k}>{element.location.country}</td>
                        <td key={k}>BORRAR</td>
                    </tr>
                )
            })
        }
    }
    

    return(
        <main>
            <h1>Prueba Técnica</h1>
            <div className="buttons">
                <button className="addColorButton">Colorear</button>
                <button className="orderByCountry">Ordenar por país</button>
                <button className="restartState">Resetear estado</button>
                <input className="filterByCountry"></input>
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>País</th>
                        <th>Acciones</th>
                    </tr>
                    {results}
                </tbody>
            </table>
        </main>
    );
}