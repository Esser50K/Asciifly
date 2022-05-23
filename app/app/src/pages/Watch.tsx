import {useSearchParams} from "react-router-dom";

function Watch() {
    let [searchParams, setSearchParams] = useSearchParams();

    return (
        <>
            <div>v= { searchParams.get('v') }</div>
        </>
    )
}

export default Watch;