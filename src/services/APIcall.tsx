
export default async function GetUser (): Promise<any[]>{
    const response = await fetch("https://randomuser.me/api/?results=100");
    const data = await response.json();
    return data.results;
}