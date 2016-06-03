import ComboboxModel from '../comboboxModel';
import TreeCollection from 'collections/tree';
import Backbone from 'backbone';

export default () => {
  describe('comboboxModel', () => {
    let model;

    describe(`with initial data`, () => {
      beforeEach(() => {
        model = new ComboboxModel();
      });

      it(`shouldn't contain any model`, () => {
        expect(model.getData().toJSON()).toEqual([]);
      });

      it(`shouldn't be in loading state`, () => {
        expect(model.isLoading()).toEqual(false);
      });

      it(`shoudn't be opened`, () => {
        expect(model.get('isOpen')).toEqual(false);
      });

      it(`should have nothing selected`, () => {
        expect(model.get('selectedId')).toEqual(null);
      });

      it(`should have notSelectedItem`, () => {
        expect(model.get('hasNotSelectedItem')).toEqual(true);
      });

      it(`shouldn't have errors`, () => {
        expect(model.get('hasError')).toEqual(false);
      });
    });

    describe(`should be able to call method`, () => {
      beforeEach(() => {
        model = new ComboboxModel();
        model.setData([
          {id: '1', text: 'first'},
          {id: '2', parentId: undefined, text: 'second'},
          {id: '3', parentId: null, text: 'third'},
          {id: '1.1', parentId: '1'},
          {id: '1.2', parentId: '1'},
          {id: '1.2.1', parentId: '1.2'},
          {id: '3.1', parentId: '3'}
        ]);
      });

      describe(`isLoading`, () => {
        it(`should return loading state`, () => {
          expect(model.get('isLoading')).toEqual(model.isLoading());
        });
      });

      describe(`getData`, () => {
        it(`should return collection instance`, () => {
          expect(model.getData() instanceof TreeCollection).toBe(true);
        });

        it(`should return the same instance of collection`, () => {
          expect(model.getData()).toBe(model.get('_data'));
        });
      });

      describe(`setData`, () => {
        beforeEach(() => {
          model.setData([{id: 5}, {id: 6}]);
        });

        it(`should change stored collection data`, () => {
          var freshData = [{id: 1}, {id: 2}];
          model.setData(freshData);
          expect(model.getData().toJSON()).toEqual(freshData);
        });

        it(`should empty collection when user don't pass any data`, () => {
          model.setData();
          expect(model.hasData()).toEqual(false);
        });
      });

      describe(`getRootItems`, () => {
        beforeEach(() => {
          model.setData([
            {id: '1'},
            {id: '2', parentId: undefined},
            {id: '3', parentId: null},
            {id: '1.1', parentId: '1'},
            {id: '1.2', parentId: '1'},
            {id: '1.2.1', parentId: '1.2'},
            {id: '3.1', parentId: '3'}
          ]);
        });

        it(`should return array instance`, () => {
          expect(_.isArray(model.getRootItems())).toEqual(true);
        });

        describe(`when 'hasNotSelectedItem' is set to FALSE`, () => {
          beforeEach(() => {
            model.set('hasNotSelectedItem', false);
          });

          it(`should return items without parentId`, () => {
            let rootItems = model.getRootItems();
            expect(rootItems.length).toEqual(3);
            expect(rootItems.map(i => i.toJSON())).toContain({id: '1'});
          });

        });

        describe(`hasNotSelectedItem`, () => {
          beforeEach(() => {
            model.set('hasNotSelectedItem', true);
          });

          it(`should contain one extra item`, () => {
            expect(model.getRootItems().length).toEqual(3 + 1);
          });

          it(`should have special item at a first position`, () => {
            expect(model.getRootItems()[0].get('id')).toEqual(null);
          });
        });
      });

      describe(`selectItem`, () => {
        beforeEach(() => {
          model.setData([
            {id: '1'},
            {id: '2', parentId: undefined},
            {id: '3', parentId: null},
            {id: '1.1', parentId: '1'},
            {id: '1.2', parentId: '1'},
            {id: '1.2.1', parentId: '1.2'},
            {id: '3.1', parentId: '3', disabled: true}
          ]);
        });

        describe(`selecting existing item`, () => {
          it(`should change selectedId property accordingly`, () => {
            expect(model.get('selectedId')).toEqual(null);
            model.selectItem('1.2.1');
            expect(model.get('selectedId')).toEqual('1.2.1');
          });

          it(`should set 'hasError' model property to FALSE`, () => {
            model.set('hasError', true);
            model.selectItem('1.2.1');

            expect(model.get('hasError')).toEqual(false);
          });

          it(`shouldn't select disabled item (without passing force flag)`, () => {
            model.selectItem(null);
            model.selectItem('3.1');

            expect(model.get('selectedId')).toEqual(null);
          });

          it(`should select disabled item when passing force flag (second argument) to TRUE`, () => {
            model.selectItem(null);
            model.selectItem('3.1', true);

            expect(model.get('selectedId')).toEqual('3.1');
          });

          it(`dropdowns should remain open (isOpen) when passing TRUE as third parameter`, () => {
            model.set({isOpen: true});
            model.selectItem('1.2.1', false, true);

            expect(model.get('isOpen')).toEqual(true);
          });
        });

        describe(`selecting not existing item`, () => {
          it(`should throw an error when hasNotSelectedItem is set to FALSE`, () => {
            model.set('hasNotSelectedItem', false);
            expect(() => {
              model.selectItem('1.2.2');
            }).toThrowError();
          });

          describe(`hasNotSelectedItem is set to TRUE`, () => {
            it(`should NOT throw an error`, () => {
              expect(() => {
                model.selectItem('1.2.2');
              }).not.toThrowError();
            });

            it(`should set selectedId to NULL value`, () => {
              model.selectItem('1.2.2');
              expect(model.get('selectedId')).toEqual(null);
            });
          });
        });
      });

      describe(`toggleOpen`, () => {
        it(`should toggle state when called multiple times`, () => {
          model.toggleOpen(); // true
          model.toggleOpen(); // false
          model.toggleOpen(); // true
          expect(model.get('isOpen')).toEqual(true);
        });

        it(`should be possible to force set value`, () => {
          model.toggleOpen(false); // false
          expect(model.get('isOpen')).toEqual(false);
        });
      });

      describe(`findItem`, () => {
        beforeEach(() => {
          model.setData([
            {id: 1, name: 'one'},
            {id: '2', name: 'two'},
            {id: 'three', name: 'three'}
          ]);
        });

        it(`should pick an item with 'id' when Number has been passed`, () => {
          expect(model.findItem(1).toJSON()).toEqual({id: 1, name: 'one'});
        });

        it(`should pick an item with 'id' when String has been passed`, () => {
          expect(model.findItem('three').toJSON()).toEqual({id: 'three', name: 'three'});
        });

        it('should find corresponding item with properties passed as object', () => {
          expect(model.findItem({name: 'two'}).toJSON()).toEqual({id: '2', name: 'two'});
        });

        it(`should return undefined value when item has not been found`, () => {
          expect(model.findItem('four')).toEqual(undefined);
        });
      });

      describe(`getSelectedItem`, () => {
        beforeEach(() => {
          model.setData([
            {id: 1, name: 'one'},
            {id: '2', name: 'two'},
            {id: 'three', name: 'three'}
          ]);
        });

        describe(`item hasn't been found`, () => {
          it(`should return undefined when hasNotSelectedItem is false`, () => {
            model.set('hasNotSelectedItem', false);
            expect(model.getSelectedItem()).toEqual(undefined);
          });

          it(`should return NotSelected model when hasNotSelectedItem is true`, () => {
            expect(model.getSelectedItem().get('text')).toEqual(model.getNotSelectedItem().get('text'));
            expect(model.getSelectedItem().get('id')).toEqual(model.getNotSelectedItem().get('id'));
          });
        });

        it(`should return currently selected item's model`, () => {
          model.set('selectedId', 1);
          expect(model.getSelectedItem().toJSON()).toEqual({id: 1, name: 'one'});
        });
      });

      describe(`hasData`, () => {
        describe(`when there are no data`, () => {
          beforeEach(() => {
            model.setData();
          });

          it(`should return false`, () => {
            expect(model.hasData()).toEqual(false);
          });
        });

        describe(`when there are at least one record`, () => {
          beforeEach(() => {
            model.setData([{id: 5}]);
          });

          it(`should return true`, () => {
            expect(model.hasData()).toEqual(true);
          });
        });

      });

      describe(`getLabel`, () => {
        describe(`when have selected item`, () => {
          beforeEach(() => {
            model.selectItem('1');
          });

          it(`and should return text property value`, () => {
            expect(model.getLabel()).toEqual(model.getSelectedItem().get('text'));
          });

          describe(`without any text specified`, () => {
            it(`should return non-braking space`, () => {
              model.selectItem('1.2');
              expect(model.getLabel()).toEqual('&nbsp;');
            });
          });
        });

        describe(`when doesn't have selected item`, () => {
          beforeEach(() => {
            model.selectItem(null);
          });

          describe(`and hasNotSelectedItem set to FALSE`, () => {
            beforeEach(() => {
              model.set('hasNotSelectedItem', false);
            });

            it(`should return non-braking space`, () => {
              expect(model.getLabel()).toEqual('&nbsp;');
            });
          });

          describe(`and hasNotSelectedItem set to TRUE`, () => {
            beforeEach(() => {
              model.set('hasNotSelectedItem', true);
            });

            it(`should return label of notSelectedItem`, () => {
              expect(model.getLabel()).toEqual(model.getNotSelectedItem().get('text'));
            });
          });
        });

        describe(`when in loading state`, () => {

        });
      });
    });

    describe(`setting`, () => {
      beforeEach(() => {
        model = new ComboboxModel();
      });

      describe(`property 'isOpen'`, () => {
        describe(`to something else than Boolean value`, () => {
          describe(`with validation set to TRUE`, () => {
            it(`should not change that value`, () => {
              let currentValue = model.get('isOpen');
              model.set({isOpen: 'stringValue'}, {validate: true});

              expect(model.get('isOpen')).toEqual(currentValue);
            });
          });
        });
      });

      describe(`property 'loadingText'`, () => {
        describe(`with value type different than String`, () => {
          describe(`and validation set to TRUE`, () => {
            it(`should not change that value`, () => {
              let currentValue = model.get('loadingText');
              model.set({loadingText: false}, {validate: true});

              expect(model.get('loadingText')).toEqual(currentValue);
            });
          });
        });
      });
    });

    describe(`properties`, () => {
      beforeEach(() => {
        model = new ComboboxModel();
        model.setData([
          {id: '1'},
          {id: '2', parentId: undefined},
          {id: '3', parentId: null},
          {id: '1.1', parentId: '1'},
          {id: '1.2', parentId: '1'},
          {id: '1.2.1', parentId: '1.2'},
          {id: '3.1', parentId: '3'}
        ]);
      });

      describe(`isDisabled`, () => {
        describe(`by default`, () => {
          it(`should have value false`, () => {
            expect(model.get('isDisabled')).toEqual(false);
          });
        });

        it(`should close dropdown when setting to true`, () => {
          model.set('isOpen', true);
          model.set('isDisabled', true);

          expect(model.get('isOpen')).toEqual(false);
        });
      });

      describe(`isLoading`, () => {
        describe(`by default`, () => {
          it(`should be set to false`, () => {
            expect(model.get('isLoading')).toEqual(false);
          });
        });

        it(`should close dropdown when is set to true`, () => {
          model.set('isOpen', true);
          model.set('isLoading', true);

          expect(model.get('isOpen')).toEqual(false);
        });
      });

      describe(`hasNotSelectedItem and notSelectedText`, () => {
        let notSelectedText = 'NOT SELECTED';

        beforeEach(() => {
          model.set({
            hasNotSelectedItem: true,
            notSelectedText
          });
        });

        describe(`first result item of called getRootItems()`, () => {
          let item;

          beforeEach(() => {
            item = model.getRootItems()[0];
          });

          it(`should have text property the same as notSelectedText`, () => {
            expect(item.get('text')).toEqual(notSelectedText);
          });

          it(`should have id of null`, () => {
            expect(item.get('id')).toEqual(null);
          });

          it(`should be instance of Backbone.Model`, () => {
            expect(item instanceof Backbone.Model).toEqual(true);
          });
        });

      });

      describe(`hasError`, () => {
        describe(`when new items has been set`, () => {
          beforeEach(() => {
            model.setData([
              {id: '1'},
              {id: '2', parentId: undefined},
              {id: '3', parentId: null},
              {id: '1.1', parentId: '1'},
              {id: '1.2', parentId: '1'},
              {id: '1.2.1', parentId: '1.2'}
            ]);
            model.selectItem('3');
          });

          describe(`which doesn't contain selected item`, () => {
            beforeEach(() => {
              model.setData([
                {id: '1'},
                {id: '2', parentId: undefined},
                // {id: '3', parentId: null},
                {id: '1.1', parentId: '1'},
                {id: '1.2', parentId: '1'},
                {id: '1.2.1', parentId: '1.2'}
              ]);
            });

            it(`should change 'hasError' to TRUE`, () => {
              expect(model.get('hasError')).toEqual(true);
            });

            it(`should change 'selectedId' to NULL`, () => {
              expect(model.get('selectedId')).toEqual(null);
            });
          });

          describe(`which contains selected item`, () => {
            describe(`and it can be selected`, () => {
              beforeEach(() => {
                model.setData([
                  {id: '1'},
                  {id: '2', parentId: undefined},
                  {id: '3', parentId: null},
                  {id: '1.1', parentId: '1'},
                  {id: '1.2', parentId: '1'},
                  {id: '1.2.1', parentId: '1.2'}
                ]);
              });

              it(`should reset 'hasError' to FALSE`, () => {
                expect(model.get('hasError')).toEqual(false);
              });
            });

            describe(`but item has 'disabled' set to TRUE`, () => {
              beforeEach(() => {
                model.setData([
                  {id: '1'},
                  {id: '2', parentId: undefined},
                  {id: '3', parentId: null, disabled: true},
                  {id: '1.1', parentId: '1'},
                  {id: '1.2', parentId: '1'},
                  {id: '1.2.1', parentId: '1.2'}
                ]);
              });

              it(`should change 'hasError' to TRUE`, () => {
                expect(model.get('hasError')).toEqual(true);
              });

              it(`'selectedId' should remain unchanged`, () => {
                expect(model.get('selectedId')).toEqual('3');
              });
            });
          });
        });
      });
    });
  })
};
