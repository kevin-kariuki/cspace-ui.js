import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { findWithType } from 'react-shallow-testutils';
import { render } from 'react-dom';
import { MemoryRouter as Router } from 'react-router';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import createTestContainer from '../../../helpers/createTestContainer';
import RecordForm from '../../../../src/components/record/RecordForm';
import MiniView from '../../../../src/components/record/MiniView';

chai.should();

const config = {
  recordTypes: {
    person: {
      fields: {},
      forms: {
        mini: {
          template: <div>Mini template</div>,
        },
      },
      name: 'person',
      title: () => 'The computed title',
    },
    organization: {
      fields: {},
      forms: {
        mini: {
          template: <div>Mini template</div>,
        },
      },
      name: 'organization',
      title: () => '',
    },
  },
};

describe('MiniView', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(
      <Router>
        <MiniView
          config={config}
          recordType="person"
        />
      </Router>, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should call readRecord when mounted if a csid is supplied', function test() {
    let readRecordCalled = false;

    const readRecord = () => {
      readRecordCalled = true;
    };

    render(
      <Router>
        <MiniView
          config={config}
          recordType="person"
          vocabulary="local"
          csid="1234"
          readRecord={readRecord}
        />
      </Router>, this.container);

    readRecordCalled.should.equal(true);
  });

  it('should call readRecord when when a new csid is supplied via props', function test() {
    let readRecordCalled = false;

    const readRecord = () => {
      readRecordCalled = true;
    };

    render(
      <Router>
        <MiniView
          config={config}
          recordType="person"
          vocabulary="local"
          csid="1234"
        />
      </Router>, this.container);

    render(
      <Router>
        <MiniView
          config={config}
          recordType="person"
          vocabulary="local"
          csid="5678"
          readRecord={readRecord}
        />
      </Router>, this.container);

    readRecordCalled.should.equal(true);
  });

  it('should render a RecordForm', function test() {
    const shallowRenderer = createRenderer();

    const result = shallowRenderer.render(
      <MiniView
        config={config}
        recordType="person"
      />);

    findWithType(result, RecordForm).should.not.equal(null);
  });

  it('should render a read only RecordForm using the \'mini\' form', function test() {
    const shallowRenderer = createRenderer();

    const result = shallowRenderer.render(
      <MiniView
        config={config}
        recordType="person"
      />);

    const recordForm = findWithType(result, RecordForm);

    recordForm.should.not.equal(null);

    recordForm.props.formName.should.equal('mini');
    recordForm.props.readOnly.should.equal(true);
  });

  it('should render the record title, linked to the record page', function test() {
    const data = Immutable.fromJS({
      document: {
        'ns2:collectionspace_core': {
          uri: '/some/path/1234',
        },
      },
    });

    const shallowRenderer = createRenderer();

    const result = shallowRenderer.render(
      <MiniView
        config={config}
        recordType="person"
        vocabulary="local"
        data={data}
      />);

    const title = findWithType(result, 'h3');

    title.should.not.equal(null);

    const link = findWithType(title, Link);

    link.should.not.equal(null);

    link.props.children.should.equal('The computed title');
    link.props.to.should.equal('/record/person/local/1234');
  });

  it('should render a <br> for the title if the computed title is empty', function test() {
    const shallowRenderer = createRenderer();

    const result = shallowRenderer.render(
      <MiniView
        config={config}
        recordType="organization"
        vocabulary="local"
      />);

    const title = findWithType(result, 'h3');

    title.props.children.type.should.equal('br');
  });
});
