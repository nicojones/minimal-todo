import React from 'react';
import './_feature.scss';


interface FeatureBoxAttrs {
  img: string;
  title: string;
}
export function FeatureBox ({ img, title }: FeatureBoxAttrs) {
  return (
    <>
      <div className="f-45 place-center">
        <div className="feature">
          <h6 className="feature__title">{ title }</h6>
          <div className="place-center">
            <img src={ img } className="feature__image" alt={ title }/>
          </div>
        </div>
      </div>
    </>
  );
}
