

/* export default async function GetUser (setData:any) {
    const response = await fetch("https://randomuser.me/api/?results=100");
    const data = await response.json();
    console.log(data.results);
    setData(data.results);
} */

export default async function GetUser (): Promise<any[]>{
    const response = await fetch("https://randomuser.me/api/?results=100");
    const data = await response.json();
    console.log(data.results);
    return data.results;
}