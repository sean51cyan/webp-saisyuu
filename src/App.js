import { Fragment, useEffect, useState } from "react";
import { fetchImages } from "./api";
import { quizData } from './quiz_data';

function Header() {
    return (
        <header className="hero is-dark is-bold">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">いろいろな犬</h1>
                </div>
            </div>
        </header>
    );
}

function Image(props) {
    return (
        <div className="card">
            <div className="card-image">
                <div className="">
                    <figure className="image">
                        <img src={props.src} alt="cute dog!" />
                    </figure>
                </div>
            </div>
        </div>
    );
}

function Loading() {
    return <p>Loading...</p>;
}

function Gallery(props) {
    const { urls } = props;
    if (urls == null) {
        return <Loading />;
    }
    return (
        <div className="columns is-vcentered is-multiline">
            {urls.map((url) => {
                return (
                    <div key={url} className="column is-4 is-offset-4">
                        <Image src={url} />
                    </div>
                );
            })}
        </div>
    );
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function ExplainQuiz() {
    return (
        <div className="content has-text-centered">
            <h1>どの犬か当ててみよう！</h1>
        </div>
    )
}

function Yudu(props) {
    function handleChange(event) {
        props.setGdd("midori");
        event.preventDefault();
    }

    return (
        <div>
            <div>
                <section className="section">
                    <div className="container">
                        <ExplainQuiz />
                    </div>
                </section>
            </div>
            <div onClick={handleChange}>
                <input type="button" value="開始" />
            </div>
        </div>
    )
}

function Momoi(props) {
    function handleChange(event) {
        props.setGdd("midori");
        if (props.finish) {
            props.setGdd("arisu");
        }
        event.preventDefault();
    }

    return (
        <div>
            <div className={'has-text-centered' + ' ' + 'is-size-1'}>
                {props.result}
            </div>
            <div onClick={handleChange}>
                <input type="button" value={props.tex} />
            </div>
        </div >
    )
}

function Arisu(props) {
    function handleChange(event) {
        props.resetQuiz();
        event.preventDefault();
    }
    return (
        <div>
            <div className="section">
                <div className="container">
                    <div className={"has-text-centered" + " " + "is-size-1"}>
                        <p>{props.correct}/{quizData.length}</p>
                    </div>
                </div>
            </div>
            <div onClick={handleChange}>
                <input type="button" value="タイトルに戻る"/>
            </div>
        </div>
    )
}

function Quiz(props) {
    const [answer, setAnswer] = useState("a");
    const handleChange = e => setAnswer(e.target.value);

    function handleSubmit(event) {
        event.preventDefault();
        // 正誤判定
        if (answer === quizData[props.number].correct) {
            props.setResult("正解です");
            props.setCorrect(props.correct + 1);
        } else {
            props.setResult("不正解です");
        }
        // 終了判定
        if (quizData.length <= props.yuuka + 1) {
            props.setTex("結果");
            props.setFinish(true);
        } else {
            props.setNumber(getRandomInt(quizData.length));
            props.setYuuka(props.yuuka + 1);
        }
        props.setGdd("momoi")
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <ul className="is-size-3">
                    <li>
                        <input type="radio" id="a" name="answer" value="a" onChange={handleChange} checked={answer === "a"} />
                        <label id="a-text" htmlFor="a">{quizData[props.number].a}</label>
                    </li>
                    <li>
                        <input type="radio" id="b" name="answer" value="b" onChange={handleChange} checked={answer === "b"} />
                        <label id="b-text" htmlFor="b">{quizData[props.number].b}</label>
                    </li>
                    <li>
                        <input type="radio" id="c" name="answer" value="c" onChange={handleChange} checked={answer === "c"} />
                        <label id="c-text" htmlFor="c">{quizData[props.number].c}</label>
                    </li>
                    <li>
                        <input type="radio" id="d" name="answer" value="d" onChange={handleChange} checked={answer === "d"} />
                        <label id="d-text" htmlFor="d">{quizData[props.number].d}</label>
                    </li>
                </ul>
                <input type="submit" value="判定" />
            </form>
        </div>
    );
}

function Main() {
    const [urls, setUrls] = useState(null);
    const [number, setNumber] = useState(getRandomInt(quizData.length));
    const [yuuka, setYuuka] = useState(0);
    const [breed, setBreed] = useState(quizData[number].dogName);
    const [result, setResult] = useState("");
    const [gdd, setGdd] = useState("yudu");
    const [correct, setCorrect] = useState(0);
    const [finish, setFinish] = useState(false);
    const [tex, setTex] = useState("次の問題");

    useEffect(() => {
        setBreed(quizData[number].dogName);
        fetchImages(quizData[number].dogName).then((urls) => {
            setUrls(urls);
        });
    }, [number,yuuka]);


    function resetQuiz() {
        setUrls(null);
        setNumber(getRandomInt(quizData.length));
        setYuuka(0);
        setBreed(quizData[0].dogName);
        setResult("");
        setGdd("yudu");
        setCorrect(0);
        setFinish(false);
        setTex("次の問題");
    }

    return (
        <main>
            {gdd === "yudu" &&
                <div className="section">
                    <div className="container">
                        <div className={"has-text-centered" + " " + "is-size-1"}>
                            <Yudu
                                setGdd={setGdd}
                            />
                        </div>
                    </div>
                </div>
            }
            {gdd === "midori" &&
                <div>
                    <section className="section">
                        <div className="container">
                            <Gallery
                                urls={urls}
                            />
                        </div>
                    </section>
                    <section className="section">
                        <div className="container">
                            <div className="has-text-centered">
                                <Quiz 
                                    setResult={setResult}
                                    setNumber={setNumber} 
                                    number={number}
                                    setYuuka={setYuuka}
                                    yuuka={yuuka}
                                    setCorrect={setCorrect}
                                    correct={correct}
                                    setGdd={setGdd}
                                    setTex={setTex} 
                                    setFinish={setFinish} 
                                />
                            </div>
                        </div>
                    </section>
                </div>
            }
            {gdd === "momoi" &&
                <div className="section">
                    <div className="container">
                        <div className={"has-text-centered" + " " + "is-size-1"}>
                            <Momoi
                                setGdd={setGdd}
                                result={result}
                                tex={tex}
                                finish={finish}
                            />
                        </div>
                    </div>
                </div>
            }
            {gdd === "arisu" &&
                <div className="section">
                    <div className="container">
                        <div className={"has-text-centered" + " " + "is-size-1"}>
                            <Arisu
                                correct={correct}
                                resetQuiz={resetQuiz}
                            />
                        </div>
                    </div>
                </div>
            }
        </main>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <p>わんわんかわいいね</p>
                <p>
                    <a href="https://dog.ceo/dog-api/about">Donate to Dog API</a>
                </p>
                <p>5420057 山田裕斗</p>
                <p>WEBプログラミング演習課題３</p>
            </div>
        </footer>
    );
}

function App() {
    return (
        <div>
            <Header />
            <Main />
            <Footer />
        </div>
    );
}

export default App;