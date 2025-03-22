import {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import './App.css';
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import CardCalendar from "./Components/CardCalendar.tsx"
import {months, platforms} from "./Shared/SharedVariables.tsx";

interface GameData {
    firstReleaseDate: string;
    releaseDate: Date;
    releaseDates: Array<Date>;
    name: number;
    id: number;
    platforms: number[];
    cover: string;
    coverImage: CoverImage;
    ratingCount: number;
}

interface CoverImage {
    url: string;
    image_Id: string;
    id: number;
    height: number;
    width: number;
}

interface DateGames {
    releaseDate: Date;
    games: GameData[];
}

export interface Month {
    monthId: number;
    name: string;
    dates: DateGames[];
    year: number;
}

interface State {
    datesGames: DateGames[];
    currentMonth: Month;
}

function App() {
    const [state, setState] = useState<State>();
    const [spinner, setSpinner] = useState(true);

    useEffect(() => {
        const fetchGameData = async () => {
            let today = new Date(Date.now());
            await populateGameData(today.getMonth() + 1, today.getFullYear());
        }
        fetchGameData().catch(error => console.log(error));
        setSpinner(false);
    }, []);

    const updateMonth = (monthId: number, year: number, datesGames: DateGames[]) => {
        var daysInMonth = new Date(year, monthId, 0).getDate();
        var monthDates: DateGames[] = [...Array(daysInMonth).keys()].map((day) => {
            var dateGames = datesGames.find((dateGame) => {
                let month = dateGame.releaseDate.getMonth() + 1;
                let releaseDay = dateGame.releaseDate.getDate() - 1;
                let releaseYear = dateGame.releaseDate.getFullYear();
                return month == monthId &&
                    releaseDay == day &&
                    releaseYear == year;
            });
            return dateGames ?? {
                releaseDate: new Date(year, monthId - 1, day + 1),
                games: []
            };
        });
        let currentMonth: Month = {
            monthId: monthId,
            name: months[monthId],
            dates: monthDates,
            year: year,
        };
        return currentMonth;
    }

    const previousMonth = async () => {
        if (state) {
            setSpinner(true);
            let year = state.currentMonth.monthId == 0
                ? state.currentMonth.year - 1
                : state.currentMonth.year;
            await populateGameData(state.currentMonth.monthId - 1, year)
                .then(() => setSpinner(false));
            ;
        }
    }
    const nextMonth = async () => {
        if (state) {
            setSpinner(true);
            let year = state.currentMonth.monthId == 11
                ? state.currentMonth.year + 1
                : state.currentMonth.year;
            await populateGameData(state.currentMonth.monthId + 1, year)
                .then(() => setSpinner(false));
        }
    }

    const calendar = state === undefined || state.datesGames === undefined
        ? <Spinner/>
        : <CardCalendar currentMonth={state.currentMonth} nextMonth={nextMonth} previousMonth={previousMonth}
                        style={{alignContent: "center"}}/>

    const contents = state === undefined || state.datesGames === undefined
        ? <div style={{color: "white"}}>
            <Spinner animation="border" role="status" variant="primary"/>
            <div>
                <em>
                    Loading... Please refresh once the ASP.NET backend has started. See
                    <a href="https://aka.ms/jspsintegrationreact"> https://aka.ms/jspsintegrationreact </a>
                    for more details.
                </em>
            </div>
        </div>
        :
        <Container style={{alignContent: "center", padding: "15px"}}>
            {state.datesGames.map((date: DateGames, index: number) =>
                (<Row key={date.releaseDate.toLocaleDateString()}
                      className="justify-content-center"
                      style={{
                          alignContent: "center",
                          //paddingBottom: "25px",
                          padding: "15px",
                          textOverflow: "clip",
                          textAlign: "left",
                          backgroundColor: index % 2 === 0 ? "#212" : "#222",
                          border: "solid 1px black",
                          borderRadius: "25px",
                          textShadow: "3px 3px 2px black",
                          fontWeight: 550,
                          boxShadow: "3px 3px 10px black"
                      }}
                    >
                        <Col lg={1} style={{color: "#f1f1f1", alignContent: "center", paddingRight: "30px"}}>
                            {date.releaseDate.toLocaleDateString()}:
                        </Col>
                        <Col>
                            {date.games.map((game: GameData) => {
                                    // let coverImage = game.cover != "0"
                                    //     && `url("//images.igdb.com/igdb/image/upload/t_cover_big/` + game.coverImage.image_Id + `.jpg")`;
                                    let gamePlatforms = game.platforms.map((p: number) => platforms[p] ?? p).join(', ');
                                    return (
                                        <Col key={game.id + game.name} style={{paddingLeft: "15px", color: "white"}}>
                                            {game.name} {gamePlatforms.length > 0 && "(" + gamePlatforms + ")"}
                                            {/*<CalendarCard game={game} coverImage={coverImage} width={"auto"}*/}
                                            {/*              style={{width: "auto", fontSize: "2rem"}}/>*/}
                                        </Col>
                                    )
                                }
                            )}
                        </Col>
                    </Row>
                )
            )}
        </Container>

    return (
        <div>
            <h1 id="tableLabel">GameDay</h1>
            {state && spinner
                ? <Spinner animation="border" role="status" variant="primary"/>
                : calendar}
            {contents}
        </div>
    );

    async function populateGameData(month: number, year: number) {
        const response = await fetch('gamedata?' +
            new URLSearchParams({
                month: month.toString(),
                year: year.toString()
            }).toString());
        if (response.ok) {
            const data = await response.json();
            let sortedData = data
                .sort((a: GameData, b: GameData) => Date.parse(a.firstReleaseDate) - Date.parse(b.firstReleaseDate))
                .map((gameData: DateGames) => {
                    return {
                        games: gameData.games,
                        releaseDate: new Date(gameData.releaseDate)
                    };
                })
            let date: Date = sortedData[0].releaseDate;
            setState({
                ...state,
                datesGames: sortedData,
                currentMonth: updateMonth(date.getMonth() + 1, date.getFullYear(), sortedData)
            });
        }
    }
}

export default App;