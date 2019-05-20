// section -> list apis and actions

export const apiConfig = {

  // Instance
  'vm': {
    icon: 'cloud',
    path: 'vm',
    label: 'Instances',
    listApi: 'listVirtualMachinesMetrics',
    column: ['name', 'instancename', 'displayname', 'ipaddress', 'account', 'zonename', 'state'],
    hidden: ['zonename', 'account', 'domain'],
    actions: [
      // Deploy VM
      {
        api: 'deployVirtualMachine',
        icon: 'plus',
        label: 'Deploy VM',
        type: 'main',
        params: ['name', 'zoneid', 'diskofferingid', 'account', 'affinitygroupids', 'affinitygroupnames',
        'customid', 'datadiskofferinglist', 'deploymentplanner', 'details', 'dhcpoptionsnetworklist', 'diskofferingid',
        'displayname', 'displayvm', 'domainid', 'group', 'hostid', 'hypervisor', 'ip6address', 'ipaddress',
        'iptonetworklist', 'keyboard', 'keypair', 'macaddress', 'name', 'networkids', 
        'projectid', 'rootdisksize', 'securitygroupids', 'securitygroupnames', 'size', 'startvm', 'userdata']
      },
      // Start
      {
        api: 'startVirtualMachine',
        icon: 'play-circle',
        label: 'Start Instance',
        type: 'main',
        params: ['id', 'deploymentplanner', 'hostid']
      },
      // Reboot
      {
        api: 'rebootVirtualMachine',
        icon: 'reload',
        label: 'Reboot Instance',
        type: 'main',
        params: ['id']
      },
      // Reboot
      {
        api: 'stopVirtualMachine',
        icon: 'stop',
        label: 'Stop Instance',
        type: 'main',
        params: ['id']
      },
      // Take Snapshot
      {
        api: 'createVMSnaphot',
        icon: 'camera',
        label: 'Create Snapshot',
        type: 'main',
        params: ['virtualmachineid', 'description', 'name', 'quiescevm', 'snapshotmemory']
      },
      // Destroy
      {
        api: 'destroyVirtualMachine',
        icon: 'delete',
        label: 'Destroy Instance',
        type: 'main',
        params: ['id']
      },
      // Reinstall VM
      {
        api: 'restoreVirtualMachine',
        icon: 'to-top',
        label: 'Reinstall Instance',
        type: 'main',
        params: ['virtualmachineid']
      },
      // Attach ISO
      {
        api: 'attachIso',
        icon: 'paper-clip',
        label: 'Attach ISO to Instance',
        type: 'main',
        params: ['id', 'virtualmachineid']
      },
      // Reset password
      {
        api: 'resetPasswordForVirtualMachine',
        icon: 'key',
        label: 'Reset Instance Password',
        type: 'main',
        params: ['id']
      },
      // Migrate to host
      {
        api: 'migrateVirtualMachine',
        icon: 'select',
        label: 'Migrate Instance to new host',
        type: 'main',
        params: ['virtualmachineid', 'hostid', 'storageid']
      },
      // Change service offering
      {
        api: 'changeServiceForVirtualMachine',
        icon: 'key',
        label: 'Change Service Offering',
        type: 'main',
        params: ['id', 'serviceofferingid']
      },
      //reset ssh key
      {
        api: 'resetSSHKeyForVirtualMachine',
        icon: 'key',
        label: 'Reset SSH key for Instance',
        type: 'main',
        params: ['id', 'keypair']
      }
    ]
  },

  // Storage Group
  'storage': {
    icon: 'database',
    path: 'storage',
    label: 'Storage',
    redirect: 'volume',
    children: [
      'volume',
      'snapshot',
      'vmsnapshot'
    ]
  },

  // Volume
  'volume': {
    icon: 'hdd',
    path: 'volume',
    label: 'Volumes',
    parent: 'storage',
    listApi: 'listVolumesMetrics',
    column: ['name', 'type', 'vmdisplayname', 'hypervisor', 'account', 'zonename', 'state'],
    hidden: ['storage', 'utilization'],
    actions: [
      {
        api: 'createVolume',
        icon: 'plus',
        label: 'Create Volumes',
        type: 'main',
        params: ['name', 'zoneid', 'diskofferingid']
      }, {
        api: 'uploadVolume',
        icon: 'cloud-upload',
        label: 'Upload Volume From URL',
        type: 'main',
        params: ['url', 'name', 'zoneid', 'format', 'diskofferingid', 'checksum']
      }, {
        api: 'getUploadParamsForVolume',
        icon: 'upload',
        label: 'Upload Local Volume',
        params: ['@file', 'name', 'zoneid', 'format', 'checksum']
      }, {
        api: 'resizeVolume',
        icon: 'fullscreen',
        label: 'Resize Volume',
        type: 'main',
        params: ['id', 'virtualmachineid']
      }, {
        api: 'attachVolume',
        icon: 'paper-clip',
        label: 'Attach Volume',
        params: ['id', 'virtualmachineid']
      }, {
        api: 'detachVolume',
        icon: 'link',
        label: 'Detach Volume',
        params: ['id', 'virtualmachineid']
      }, {
        api: 'extractVolume',
        icon: 'cloud-download',
        label: 'Download Volume',
        params: ['id', 'zoneid', 'mode'],
        paramOptions: {
          'mode': {
            'value': 'HTTP_DOWNLOAD'
          }
        }
      }, {
        api: 'migrateVolume',
        icon: 'drag',
        label: 'Migrate Volume',
        params: ['volumeid', 'storageid', 'livemigrate']
      }, {
        api: 'deleteVolume',
        icon: 'delete',
        label: 'Delete Volume',
        params: ['id']
      }
    ]
  },

  // Snapshot Tab
  'snapshot': {
    icon: 'build',
    path: 'snapshot',
    label: 'Snapshots',
    parent: 'storage',
    listApi: 'listSnapshots',
    column: ['volumename', 'name', 'intervaltype', 'created', 'state'],
    hidden: [],
    actions: [
    ]
  },

  // VM Snapshot Tab
  'vmsnapshot': {
    icon: 'camera',
    path: 'vmsnapshot',
    label: 'VM Snapshots',
    parent: 'storage',
    listApi: 'listVMSnapshot',
    column: ['displayname', 'state', 'type', 'current', 'parentName', 'created'],
    hidden: ['storage'],
    actions: [
    ]
  },

  // Guest Network
  'guestnetwork': {
    icon: 'wifi',
    listApi: 'listNetworks',
    column: ['name', 'type', 'cidr', 'ip6cidr', 'account', 'zonename', 'state'],
    hidden: [],
    actions: [
      {
        api: 'deleteNetwork',
        icon: 'delete',
        label: 'Delete Network',
        params: ['id']
      }
    ]
  },

  // Templates
  'templates': {
    icon: 'save',
    listApi: 'listTemplates',
    column: ['name', 'hypervisor', 'ostype', 'account', 'order'],
    hidden: [],
    actions: [
      {
        api: 'registerTemplate',
        icon: 'plus',
        label: 'Create template',
        type: 'main',
        params: ['displaytext', 'format', 'hypervisor', 'name', 'ostypeid', 'url', 'account', 'bits', 'checksum', 'details', 'directdownload', 'domainid', 'isdynamicallyscalable', 'isextractable', 'isfeatured', 'ispublic', 'isrouting', 'passwordenabled', 'projectid', 'requireshvm', 'sshkeyenabled', 'templatetag', 'zoneid', 'zoneids']
      }]
  },
  // Security Groups
  'securitygroups': {
    column: ['name', 'description', 'domain', 'account'],
    actions: []
  },

  'vpc': {
    column: ['name', 'displaytext', 'zonename', 'cidr', 'state'],
    actions: []
  },

  'vpngateway': {
    column: ['name', 'gateway', 'cidrlist', 'ipsecpsk'],
    actions: []
  },

  'template': {
    column: ['name', 'hypervisor', 'ostypename', 'account'],
    actions: []
  },

  'iso': {
    column: ['name', 'ostypename', 'account'],
    actions: []
  },

  'events': {
    column: ['description', 'level', 'type', 'account', 'username', 'domain', 'created'],
    actions: []
  },

  'alerts': {
    column: ['description', 'type', 'sent'],
    actions: []
  },

  'project': {
    column: ['name', 'displaytext', 'domain', 'account', 'state'],
    actions: []
  },

  'affinitygroups': {
    column: ['name', 'type'],
    actions: []
  },

  'ssh': {
    column: ['name', 'domain', 'account', 'privatekey'],
    actions: []
  },

  'user': {
    column: ['username', 'firstname', 'lastname'],
    actions: []
  },

  'account': {
    column: ['name', 'rolename', 'roletype', 'domainpath', 'state'],
    actions: []
  },

  // 'domain': {
  //   column: [],
  //   actions: []
  // },

  'role': {
    column: ['name', 'type', 'description'],
    actions: []
  },

  'zone': {
    column: ['name', 'networktype', 'state'],
    actions: []
  },

  'pod': {
    column: ['name', 'gateway', 'netmask', 'zonename', 'allocationstate'],
    actions: []
  },

  'cluster': {
    column: ['name', 'hypervisortype', 'zonename', 'podname', 'managedstate', 'allocationstate'],
    actions: []
  },

  'host': {
    column: ['name', 'ipaddress', 'hypervisor', 'zonename', 'clustername', 'resourcestate', 'state', 'powerstate'],
    actions: []
  },

  'primarystorage': {
    column: ['name', 'ipaddress', 'path', 'type', 'scope', 'clustername', 'zonename', 'state'],
    actions: []
  },

  'secondarystorage': {
    column: ['name', 'url', 'protocol', 'scope', 'zonename'],
    actions: []
  },

  'systemvm': {
    column: ['name', 'systemvmtype', 'publicip', 'hostname', 'zonename', 'state', 'agentstate'],
    actions: []
  },

  // 'router': {
  //   column: [],
  //   actions: []
  // },

  // 'cpusocket': {
  //   column: [],
  //   actions: []
  // },

  // 'computeoffering': {
  //   column: [],
  //   actions: []
  // },

  // 'diskoffering': {
  //   column: [],
  //   actions: []
  // },

  // 'networkoffering': {
  //   column: [],
  //   actions: []
  // },

  // 'vpcoffering': {
  //   column: [],
  //   actions: []
  // },

  // 'systemoffering': {
  //   column: [],
  //   actions: []
  // },

  'ldapsetting': {
    column: ['hostname', 'port'],
    actions: [
      {
        api: 'addLdapConfiguration',
        icon: 'plus',
        label: 'Create ',
        type: 'main',
        params: ['hostname', 'port', 'domainid']
      }]
  },

  'globalsetting': {
    column: ['name', 'description', 'value'],
    actions: []
  }

  // 'hypervisorcapability': {
  //   column: [],
  //   actions: []
  // }
}
