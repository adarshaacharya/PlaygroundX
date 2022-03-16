import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import React from 'react';
import './styles.css';

interface ResizableProps {
  direction?: 'horizontal' | 'vertical';
}


const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = React.useState(window.innerWidth);
  const [width, setWidth] = React.useState(window.innerWidth * 0.75);

  React.useEffect(() => {
    let timer: NodeJS.Timer;

    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);

        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        } 
      }, 100);
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [width]);

  const resizableBoxProps: ResizableBoxProps = {
    onResizeStop: (event, data) => {
      setWidth(data.size.width); 
    },
    className: 'resize-horizontal',
    minConstraints: [innerWidth * 0.2, Infinity], // horizonal, vertical resizing
    maxConstraints: [innerWidth * 0.75, Infinity],
    height: Infinity,
    width, // determines width of editor too
    resizeHandles: ['e'],
  };

  return <ResizableBox {...resizableBoxProps}>{children}</ResizableBox>;
};

export default Resizable;
