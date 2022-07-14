import React from 'react';

export interface StorybookDescriptorProps {
  title: string;
}

const StorybookDescriptor: React.FC<StorybookDescriptorProps> = ({
  children,
  title,
}) => {
  return (
    <div className="mb-2">
      <h6 className="text-gray-800">{title}</h6>
      <div>{children}</div>
    </div>
  );
};

export { StorybookDescriptor };
export default StorybookDescriptor;
