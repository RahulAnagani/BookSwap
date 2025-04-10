type prop={
    value:string,
    bg:string
}
const Genre:React.FC<prop>=({value,bg})=>{
    return (
        <>
            <button className={`${bg} cursor-pointer rounded p-2 font-bold text-white`}>{value}</button>
        </>
    )
}
export default Genre;