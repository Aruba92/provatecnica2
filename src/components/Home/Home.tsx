import { useEffect, useState } from "react";
import GetUser from "../../services/APIcall";
import "./home.css";

export default function Home () {

    const [data, setData] = useState<any[]>([]);
    const [colorButton, setColorButton] = useState(false);

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

    function toggleColor () {
        setColorButton(!colorButton);
    }
    

    return(
        <main>
            <h1>Prueba Técnica</h1>
            <div className="buttons">
                <button className="addColorButton" onClick={toggleColor}>Colorear</button>
                <button className="orderByCountry">Ordenar por país</button>
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
                <tbody className={colorButton ? "colorActive" : ""}>
                    {results}
                </tbody>
            </table>
        </main>
    );
}