import { defineMessages } from 'react-intl';

export default (pluginContext) => {
  const {
    AuthorityControlledInput,
    CompoundInput,
    // DateInput,
    // IDGeneratorInput,
    // OptionListControlledInput,
    // StructuredDateInput,
    TextInput,
    // VocabularyControlledInput,
  } = pluginContext.inputComponents;

  const {
    configKey: config,
  } = pluginContext.configHelpers;

  return {
    document: {
      [config]: {
        view: {
          type: CompoundInput,
          props: {
            defaultChildSubpath: 'ns2:persons_common',
          },
        },
      },
      'ns2:persons_common': {
        [config]: {
          service: {
            ns: 'http://collectionspace.org/services/person',
          },
        },
        personTermGroupList: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.persons_common.personTermGroupList.name',
                defaultMessage: 'Terms',
              },
            }),
            view: {
              type: CompoundInput,
            },
          },
          personTermGroup: {
            [config]: {
              view: {
                type: CompoundInput,
                props: {
                  repeating: true,
                },
              },
            },
            termDisplayName: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.persons_common.termDisplayName.name',
                    defaultMessage: 'Display name',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
            termSource: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.persons_common.termSource.name',
                    defaultMessage: 'Source',
                  },
                }),
                view: {
                  type: AuthorityControlledInput,
                  props: {
                    authority: 'citation/local,citation/shared,citation/worldcat',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};