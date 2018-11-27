import React from 'react';

export const Loading = (props) =>
<div style = {{
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -80%)',
  textAlign: 'center',
  opacity: 0.25
}}>
  {props.children}
</div>

export default Loading;
