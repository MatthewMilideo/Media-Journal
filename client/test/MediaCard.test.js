import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import MediaCard from '../src/components/smallComponents/MediaCard';
import Card from 'react-bootstrap/Card'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe('<MediaCard />', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(<MediaCard />);
    console.log(wrapper.find(<Card></Card>));
    expect((wrapper.find(<Card/>)).to.have.lengthOf(1));
  });
});