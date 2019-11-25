import 'isomorphic-fetch';
import Link from 'next/link';
import Error from 'next/error';

export default class extends React.Component {
  
  static async getInitialProps({ res }) {
    try {
      let req = await fetch('https://api.audioboom.com/channels/recommended')
      let { body: channels } = await req.json()
      return { channels, statusCode: 200 };
    } catch(e) {
      res.statusCode = 503;
      return { channels: null, statusCode: 503 }
    }
  }

  render(){
  const { channels, statusCode } = this.props; 
    if( statusCode !== 200 ) {
      return <Error statusCode={statusCode} />;
    }
    return (
      <div>
        <header>Podcast</header>
        <div className="channels">
          {channels &&
            channels.map(item => {
              return (
                <Link href={`/channel?id=${item.id}`} prefetch>
                  <a className="channel">
                    <img src={item.urls.logo_image.original} />
                    <h2>{item.title}</h2>
                  </a>
                </Link>
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