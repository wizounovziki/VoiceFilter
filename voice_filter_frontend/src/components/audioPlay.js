import React, { Component } from "react";

class AudioPlay extends React.Component {
    render() {
        return (
            <div className="user_part">
                <div style={{ width: "100%", textAlign: "center" }}>
                    <p>{this.props.text}</p>
                    <audio
                        style={{ position: "relative", left: "0%" }}
                        preload="metadata"
                        controls="controls"
                        src={this.props.src}
                        // autoPlay
                        ref={(audio) => {
                            this.lectureAudio = audio;
                        }}
                    >
                    </audio>
                    {/* <ReactPlayer url={this.props.src} playing /> */}
                </div>
            </div>
        );
    }
}

export default AudioPlay