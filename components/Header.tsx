// components/Header.tsx

// 1. 이 Header라는 레고 블록(함수)을 정의한다.
export default function Header(){
    // 2. 이 블록은 이런 모양(<h1>)을 반환한다.
    return(
        <h1 className="text-3xl font-bold">
            Hello from Header Component!
        </h1>
    );
}