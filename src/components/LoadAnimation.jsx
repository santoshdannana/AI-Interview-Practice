import React, { useEffect } from 'react';

const LoadAnimation = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div className="loader" style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      background: 'white'
    }}>
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <dotlottie-player
              src="https://lottie.host/1a9fa61a-c5c7-4e2b-a8b9-5b4db881c7b5/sbrVA29ksj.lottie"
              background="transparent"
              speed="1"
              style="width: 300px; height: 300px"
              loop
              autoplay>
            </dotlottie-player>
          `
        }}
      />
      <p style={{
        marginTop: '1rem',
        fontSize: '1.2rem',
        fontWeight: '500',
        color: '#000'
      }}>
        <strong>Getting your questions ready...</strong>
      </p>
    </div>
  );
};

export default LoadAnimation;
