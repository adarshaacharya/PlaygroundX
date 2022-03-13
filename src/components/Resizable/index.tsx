import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import React from 'react';
import './styles.css';

interface ResizableProps {
  direction?: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const resizableProps: ResizableBoxProps = {
    className: 'resize-horizontal',
    minConstraints: [window.innerWidth * 0.2, 24], // horizonal, vertical resizing
    maxConstraints: [window.innerWidth * 0.75, Infinity],
    height: Infinity,
    width: window.innerWidth * 0.75, // determines width of editor
    resizeHandles: ['e'],
  };

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
