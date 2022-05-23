import {useSearchParams} from "react-router-dom";

function Watch({ match, location }: any) {
    let [searchParams, setSearchParams] = useSearchParams();

    return (
        <>
            <div>v= { searchParams.get('v') }</div>
        </>
    )
}

export default Watch;