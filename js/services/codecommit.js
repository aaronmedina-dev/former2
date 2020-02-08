/* ========================================================================== */
// CodeCommit
/* ========================================================================== */

sections.push({
    'category': 'Developer Tools',
    'service': 'CodeCommit',
    'resourcetypes': {
        'Repositories': {
            'columns': [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        formatter: primaryFieldFormatter,
                        footerFormatter: textFormatter
                    },
                    {
                        title: 'Properties',
                        colspan: 4,
                        align: 'center'
                    }
                ],
                [
                    {
                        field: 'id',
                        title: 'ID',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    }
                ]
            ]
        },
        'Notification Rules': {
            'columns': [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true,
                        formatter: primaryFieldFormatter,
                        footerFormatter: textFormatter
                    },
                    {
                        title: 'Properties',
                        colspan: 4,
                        align: 'center'
                    }
                ],
                [
                    {
                        field: 'resource',
                        title: 'Resource',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    },
                    {
                        field: 'detailtype',
                        title: 'Detail Type',
                        sortable: true,
                        editable: true,
                        footerFormatter: textFormatter,
                        align: 'center'
                    }
                ]
            ]
        }
    }
});

async function updateDatatableDeveloperToolsCodeCommit() {
    blockUI('#section-developertools-codecommit-repositories-datatable');
    blockUI('#section-developertools-codecommit-notificationrules-datatable');

    await sdkcall("CodeCommit", "listRepositories", {
        // no params
    }, true).then(async (data) => {
        $('#section-developertools-codecommit-repositories-datatable').bootstrapTable('removeAll');

        await Promise.all(data.repositories.map(repository => {
            return sdkcall("CodeCommit", "getRepository", {
                repositoryName: repository.repositoryName
            }, true).then((data) => {
                $('#section-developertools-codecommit-repositories-datatable').bootstrapTable('append', [{
                    f2id: data.repositoryMetadata.repositoryId,
                    f2type: 'codecommit.repository',
                    f2data: data.repositoryMetadata,
                    f2region: region,
                    name: data.repositoryMetadata.repositoryName,
                    id: data.repositoryMetadata.repositoryId
                }]);
            });
        }));

        unblockUI('#section-developertools-codecommit-repositories-datatable');
    });

    await sdkcall("CodeStarNotifications", "listNotificationRules", {
        // no params
    }, false).then(async (data) => {
        $('#section-developertools-codebuild-notificationrules-datatable').bootstrapTable('removeAll');

        await Promise.all(data.NotificationRules.map(notificationRule => {
            return sdkcall("CodeStarNotifications", "describeNotificationRule", {
                Arn: notificationRule.Arn
            }, false).then(async (data) => {
                if (data.Resource.split(":")[2] == "codecommit") {
                    $('#section-developertools-codebuild-notificationrules-datatable').bootstrapTable('append', [{
                        f2id: data.Arn,
                        f2type: 'codestarnotifications.notificationrule',
                        f2data: data,
                        f2region: region,
                        name: data.Name,
                        resource: data.Resource,
                        detailtype: data.DetailType
                    }]);
                }
            });
        }));
    }).catch(() => { });

    unblockUI('#section-developertools-codecommit-notificationrules-datatable');
}