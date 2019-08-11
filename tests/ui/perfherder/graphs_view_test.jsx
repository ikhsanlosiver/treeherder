import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  // waitForElementToBeRemoved,
  // wait,
} from '@testing-library/react';

import GraphsViewControls from '../../../ui/perfherder/graphs/GraphsViewControls';
// import { summaryStatusMap } from '../../../ui/perfherder/constants';
import repos from '../mock/repositories';
import testData from '../mock/performance_summary.json';
import seriesData from '../mock/performance_signature.json';

const frameworks = [{ id: 1, name: 'talos' }, { id: 2, name: 'build_metrics' }];
const platforms = ['linux64', 'windows10-64', 'windows7-32'];

const graphsViewControls = () =>
  render(
    <GraphsViewControls
      updateStateParams={() => {}}
      graphs={false}
      highlightAlerts={false}
      highlightedRevisions={['', '']}
      updateTimeRange={() => {}}
      hasNoData
      frameworks={frameworks}
      projects={repos}
      timeRange={{ value: 172800, text: 'Last two days' }}
      options={{}}
      getTestData={() => {}}
      testData={testData}
      getInitialData={() => ({
        platforms,
      })}
      getSeriesData={() => ({ seriesData })}
    />,
  );

afterEach(cleanup);

// Tests:
// testDataModal is opened when add test data is clicked
// testDataModal shows all tests in Tests text area except for what's in legend (testData)
// changing a dropdown updates Test list
// clicking on a test adds it to selectedTests
// clicking submit closes the modal

test('changing framework and repository from the test data modal shows the correct test', async () => {
  const {
    getByText,
    getByTestId,
    queryByTestId,
    getByTitle,
  } = graphsViewControls();
  const addTestData = getByText('Add test data');

  fireEvent.click(addTestData);
  const testDataModal = getByText('Add Test Data');
  expect(testDataModal).toBeInTheDocument();

  const tests = getByTestId('tests');
  const selectedTests = getByTestId('selectedTests');

  const platform = getByTitle('Platform');
  fireEvent.click(platform);

  const windowsPlatform = await waitForElement(() => getByText('windows7-32'));

  fireEvent.click(windowsPlatform);

  // If a test has already been added to the legend (testData),
  // then it should not be included in the TestDataModals' list of Tests
  // (based on framework, repository and platform)
  const existingTest = queryByTestId(testData[0].signature_id.toString());
  expect(existingTest).not.toBeInTheDocument();
});