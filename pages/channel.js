import Error from "next/error";

export default class extends React.Component {

  static async getInitialProps({ query, res }) {

    let idChannel = query.id;
    try {
      let [reqChannel, reqAudio, reqSeries] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(
          `https://api.audioboom.com/channels/${idChannel}/audio_clips`
        ),
        fetch(
          `https://api.audioboom.com/channels/${idChannel}/child_channels`
        )
      ]);

      if(reqChannel.status === 404) {
        res.statusCode = reqChannel.status;
        return { channel: null , audioCLips: null , series:null , statusCode: 404 };
      }

      let dataChannel = await reqChannel.json();
      let channel = dataChannel.body.channel;

      let dataAudio = await reqAudio.json();
      let audioCLips = dataAudio.body.audio_clips;

      let dataSeries = await reqSeries.json();
      let series = dataSeries.body.channels;

      return { channel, audioCLips, series, statusCode: 200 };
    }
    catch(e) {
      return { channels: null, statusCode: 503 };
    }
  }

  render() {
    const { channel, audioCLips, series, statusCode } = this.props; 
    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }
    return (
      <div>
        <header>Podcast</header>
        <h1>{channel.title}</h1>
        <h2>Series</h2>
        <div className="channels">
          {audioCLips &&
            audioCLips.map(item => {
              return (
                <a className="channel">
                  <h2>{item.title}</h2>
                </a>
              );
            })}
        </div>
        <h2>Ultimos Podcast</h2>
        <div className="channels">
          {series &&
            series.map(item => {
              return (
                <a className="channel">
                  <h2>{item.title}</h2>
                </a>
              );
            })}
        </div>
        <style jsx>{`
          header {
            color: #fff;
            background: #8756ca;
            padding: 15px;
            text-align: center;
          }
          .channels {
            display: grid;
            grip-gap: 30px;
            padding: 20px;
            grip-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
          .channel {
            display: block;
            border-radius: 3px;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
            margin-bottom: 0.5em;
          }
          .channel img {
            width: 100%;
          }
          h1 {
            font-weight: 600;
            padding: 15px;
          }
          h2 {
            padding: 5px;
            font-size: 0.9em;
            font-weight: 600;
            margin: 0;
            text-align: center;
          }
        `}</style>
        <style jsx global>{`
          body {
            margin: 0;
            background: white;
            font-family: system-ui;
          }
        `}</style>
      </div>
    );
  }
}