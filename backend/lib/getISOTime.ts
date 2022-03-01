export default function getISOTime(){
    const now = new Date();
    return now.toISOString();
}