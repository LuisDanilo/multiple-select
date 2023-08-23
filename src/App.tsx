import './App.css'
import { FormControl, Select, MenuItem, ListSubheader, Button, Box, Chip, InputLabel, Stack } from '@mui/material'
import { useCallback, useState } from 'react';
import get from 'lodash.get'

const superTypes = [
  {
    id: 1000,
    name: 'Estrategia',
    types: [
      {
        id: 100,
        name: 'Estategia 1',
        subtypes: [
          { id: 10, name: 'Sub estrategia 1'},
          { id: 11, name: 'Sub estrategia 2'},
          { id: 12, name: 'Sub estrategia 3'},
          { id: 13, name: 'Sub estrategia 4'},
        ]
      },
      {
        id: 101,
        name: 'Estategia 2',
        subtypes: [
          { id: 14, name: 'Sub estrategia 5'},
          { id: 15, name: 'Sub estrategia 6'},
          { id: 16, name: 'Sub estrategia 7'},
          { id: 17, name: 'Sub estrategia 8'},
        ]
      }
    ]
  },
  {
    id: 2000,
    name: 'Cultura',
    types: [
      {
        id: 200,
        name: 'Cultura 1',
        subtypes: [
          { id: 20, name: 'Sub cultura 1'},
          { id: 21, name: 'Sub cultura 2'},
          { id: 22, name: 'Sub cultura 3'},
          { id: 23, name: 'Sub cultura 4'},
        ]
      },
      {
        id: 201,
        name: 'Cultura 2',
        subtypes: [
          { id: 20, name: 'Sub cultura 5'},
          { id: 21, name: 'Sub cultura 6'},
          { id: 22, name: 'Sub cultura 7'},
          { id: 23, name: 'Sub cultura 8'},
        ]
      }
    ]
  }
]

function App() {

  const [values, setValues] = useState<any>([])

  const handleItemClick = useCallback((st: any, t: any) => {
    if(values.some((val: any) => st.types.map(({id}: any) => id).includes(val.type_id))) {
      // Cannot add selected type "t".
      // Only one type per supertype allowed.
      // Already added a type of same supertype as "t"
      console.log("No add");
    } else {
      const t2 = {
        name: t.name,
        type_id: t.id,
        super_type_id: st.id,
        subtype: ''
      }
      console.log(`Adding ${t.name}`);
      console.log(`Current values are ${values}`);     
      setValues((v: string[]) => [...v, t2])
    }
  }, [values])

  const handleSubItemClick = useCallback((t: any, subt: any) => {
    setValues((vals: any) => vals.map((v: any) => {
      if(v.type_id === t.type_id) {
        return {
          ...v,
          subtype: subt.id
        }
      }
      return v
    }))
  }, [])

  return (
    <>
      <Stack>
      <FormControl sx={{ m: 1, minWidth: 120, width: 'inherit'}}>
        <InputLabel htmlFor="grouped-select">Reconocimientos</InputLabel>
        <Select 
          id="grouped-select"
          label="Reconocimientos" 
          fullWidth 
          multiple={true}
          value={values}
          autoComplete='off'
          renderValue={(selected: any) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((s: any, idx: number) => (
                <Chip 
                  key={`t-chip-${idx}`} 
                  label={s.name}
                />
              ))}
            </Box>
          )}
        >
          <MenuItem value="">
            <em>--Seleccione un tipo--</em>
          </MenuItem>
          {
            superTypes.reduce((accum: any, st) => {
                accum.push(<ListSubheader key={`st-${st.id}`}>{st.name}</ListSubheader>)
                accum.push(...st.types.map(t => (
                    <MenuItem 
                      key={`t-mi-${t.id}`} 
                      value={t.id}
                      onClick={() => handleItemClick(st, t)}
                    >
                      {t.name}
                    </MenuItem>
                )))
                return accum
              }, [])
          }
        </Select>
      </FormControl>
      <Stack>
        {
          values.map((selectedType: any) => {
            const foundSuperType = superTypes.find(st => st.id === selectedType.super_type_id)
            const foundType = foundSuperType && foundSuperType.types.find(t => t.id === selectedType.type_id)
            if(foundType && get(foundType, 'subtypes', []).length > 0) {
              return <FormControl key={`subt-select-${selectedType.type_id}`} sx={{ m: 1, minWidth: 120, width: 'inherit'}}>
                <InputLabel size='small' htmlFor="grouped-select">Subtipo para {selectedType.name}</InputLabel>
                <Select
                  size='small'
                  id="grouped-select"
                  label={"Subtipo para" + selectedType.name}
                  fullWidth 
                  // value={selectedType.subtype}
                  defaultValue={''}
                  autoComplete='off'
                  renderValue={(selected: any) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip label={get(foundType.subtypes.find(subt => subt.id === selected), 'name', '--no name--')}/>
                    </Box>
                  )}
                >
                  <MenuItem value="">
                    <em>--Seleccione un subtipo--</em>
                  </MenuItem>
                  {
                    foundType.subtypes.map((subt: any) => (
                      <MenuItem 
                        key={`subt-mi-${subt.id}`} 
                        value={subt.id}
                        onClick={() => handleSubItemClick(selectedType, subt)}
                      >
                        {subt.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            }           
          })
        }
      </Stack>
      <Button variant='contained' onClick={() => console.log(values)}>🚀 Enviar reconocimiento</Button>
    </Stack>
    </>
  )
}

export default App
